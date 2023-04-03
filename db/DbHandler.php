<?php
 
class DbHandler { 
    function __construct() {
        require_once dirname(__FILE__) . '/db.php'; 
        $db = new DbConnect(); 
        $this->conn = $db->connect();
    } 
	  public function close() {$conn=null;}  
 
	 public function addPay($iuser){
		$stmt = $this->conn->prepare("INSERT INTO completions_pay(cidapi) VALUES (:id)"); 
		$stmt->bindParam(':id',$iuser);  
		$result = $stmt->execute();
		$id = $this->conn->lastInsertId();
		$stmt->closeCursor();
		return $id;
	}
	public function addpayCompletion($id,$sessions){ 
		$stmt = $this->conn->prepare("UPDATE completions SET idpayin =:i WHERE status=1 and csession in (".$sessions.")");  
		$stmt->bindParam(':i', $id);     
		$result = $stmt->execute(); 
		$stmt->closeCursor(); 
	}
	public function addpaying($id,$monto){ 
		$stmt = $this->conn->prepare("UPDATE completions_pay SET status=2,costoBOB=:m,fechastatus=CURRENT_TIMESTAMP WHERE idpay=:i");  
		$stmt->bindParam(':i', $id);     
		$stmt->bindParam(':m', $monto);     
		$result = $stmt->execute(); 
		$stmt->closeCursor(); 
	}

   public function getCdata($id) { 
	$stmt = $this->conn->prepare("SELECT cdata FROM completions  WHERE csession=:u ORDER BY idc DESC LIMIT 1"); 
	$stmt->bindParam(':u',$id); 
	$stmt->execute();
	$CountReg = $stmt->fetchAll(PDO::FETCH_ASSOC);    
	$stmt->closeCursor(); 
	$this->close();  
	return $CountReg;  
	}
   public function getsessions($id) { 
	$stmt = $this->conn->prepare("SELECT cidapi,csession, DATE_FORMAT(fcprompt,'%Y-%m-%d') as fecha, DATE_FORMAT(fcprompt,'%Y.%m') as mes,DATE_FORMAT(fcprompt,'%T') as hora,SUM(total_tokens) as total FROM completions where cidapi=:ss and total_tokens>0 group by csession ORDER by 3 DESC,5 DESC;");  
	$stmt->bindParam(':ss',$id, PDO::PARAM_STR, 12); 
	$stmt->execute();
	$CountReg = $stmt->fetchAll(PDO::FETCH_ASSOC);    
	$stmt->closeCursor(); 
	$this->close();  
	return $CountReg;  
	}
   public function getsessionspay($id) { 
	$stmt = $this->conn->prepare("SELECT cidapi,csession, DATE_FORMAT(fcprompt,'%Y-%m-%d') as fecha,SUM(total_tokens) as total FROM completions where cidapi=:ss and total_tokens>0 and idpayin = 0 group by csession ORDER by idc");  
	$stmt->bindParam(':ss',$id, PDO::PARAM_STR, 12); 
	$stmt->execute();
	$CountReg = $stmt->fetchAll(PDO::FETCH_ASSOC);    
	$stmt->closeCursor(); 
	$this->close();  
	return $CountReg;  
	}
   public function getsessionspaying($id) { 
	$stmt = $this->conn->prepare("select * from completions_pay where cidapi=:ss");  
	$stmt->bindParam(':ss',$id); 
	$stmt->execute();
	$CountReg = $stmt->fetchAll(PDO::FETCH_ASSOC);    
	$stmt->closeCursor(); 
	$this->close();  
	return $CountReg;  
	}
   public function getsessionHistory($id,$sess) { 
	$stmt = $this->conn->prepare("SELECT cprompt,fcprompt,ccompletion,fccompletion FROM completions where cidapi=:ss and total_tokens>0 and csession=:se ORDER by idc");  
	$stmt->bindParam(':se',$sess, PDO::PARAM_STR, 12); 
	$stmt->bindParam(':ss',$id, PDO::PARAM_STR, 12); 
	$stmt->execute();
	$CountReg = $stmt->fetchAll(PDO::FETCH_ASSOC);    
	$stmt->closeCursor(); 
	$this->close();  
	return $CountReg;  
	}

   public function getcompletion($id) { 
			$stmt = $this->conn->prepare("SELECT c.* FROM completions c WHERE  c.idc=:u"); 
			$stmt->bindParam(':u',$id); 
			$stmt->execute();
			$CountReg = $stmt->fetchAll(PDO::FETCH_ASSOC);    
			$stmt->closeCursor(); 
			$this->close();  
		return $CountReg[0];  
   }
  
		public function addPrompt($nom,$cidapi,$csession,$cprompt,$ctemperature,$cmaxtoken,$cmodel,$blob){
			$stmt = $this->conn->prepare("INSERT INTO completions(cnom,cidapi,cprompt,ctemperature,cmaxtoken,cmodel,csession,cdata) VALUES (:nm,:id,:cp,:ct,:cm,:mm,:ss,:bo)"); 
			$stmt->bindParam(':id',$cidapi); 
			$stmt->bindParam(':bo', $blob, PDO::PARAM_LOB);
			$stmt->bindParam(':cp',$cprompt, PDO::PARAM_STR, 12); 
			$stmt->bindParam(':ss',$csession, PDO::PARAM_STR, 12); 
			$stmt->bindParam(':nm',$nom, PDO::PARAM_STR, 12); 
			$stmt->bindParam(':ct',$ctemperature); 
			$stmt->bindParam(':cm',$cmaxtoken); 
			$stmt->bindParam(':mm',$cmodel, PDO::PARAM_STR, 12);   
			$result = $stmt->execute();
			$id = $this->conn->lastInsertId();
			$stmt->closeCursor();
			return $id;
		}
		
		public function addCompletion($id,$ccompletion,$prompt_tokens,$completion_tokens,$total_tokens,$idcompletion,$blob){ 
			$stmt = $this->conn->prepare("update completions set status=1,fccompletion=CURRENT_TIMESTAMP,ccompletion=:cp,prompt_tokens=:ct,completion_tokens=:cm,total_tokens=:tt,idcompletion=:mm,cdata=:bo where idc=:i");  
            $stmt->bindParam(':i', $id);  
			$stmt->bindParam(':bo', $blob, PDO::PARAM_LOB); 
			$stmt->bindParam(':cp',$ccompletion, PDO::PARAM_STR, 12); 
			$stmt->bindParam(':ct',$prompt_tokens); 
			$stmt->bindParam(':cm',$completion_tokens); 
			$stmt->bindParam(':tt',$total_tokens); 
			$stmt->bindParam(':mm',$idcompletion, PDO::PARAM_STR, 12);   
			$result = $stmt->execute(); 
			$stmt->closeCursor(); 
		}
		public function addCompletionError($id,$error){ 
			$stmt = $this->conn->prepare("update completions set flog=CURRENT_TIMESTAMP,log=:lo where idc=:i");  
            $stmt->bindParam(':i', $id); 
			$stmt->bindParam(':lo',$error, PDO::PARAM_STR, 12);  
			$result = $stmt->execute(); 
			$stmt->closeCursor(); 
		}
     
} 
?>
